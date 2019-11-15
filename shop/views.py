
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view()
def null_view(request):
    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view()
def complete_view(request):
    return Response("Email account is activated")

from allauth.account import app_settings
from allauth.account.adapter import get_adapter
from allauth.account.models import EmailConfirmation, EmailConfirmationHMAC
from django.contrib import messages
from django.contrib.sites.shortcuts import get_current_site
from django.http import (
    Http404,
)
from django.shortcuts import redirect
from django.views.generic.base import TemplateResponseMixin, View


class ConfirmEmailView(TemplateResponseMixin, View):

    template_name = "account/email/email_confirmation_message.txt"

    def get(self, *args, **kwargs):
        try:
            self.object = self.get_object()
            if app_settings.CONFIRM_EMAIL_ON_GET:
                return self.post(*args, **kwargs)
        except Http404:
            self.object = None
        ctx = self.get_context_data()
        return self.render_to_response(ctx)

    def post(self, *args, **kwargs):
        self.object = confirmation = self.get_object()
        confirmation.confirm(self.request)
        get_adapter(self.request).add_message(
            self.request,
            messages.SUCCESS,
            'account/messages/email_confirmed.txt',
            {'email': confirmation.email_address.email})
        # Don't -- allauth doesn't touch is_active so that sys admin can
        # use it to block users et al
        #
        # user = confirmation.email_address.user
        # user.is_active = True
        # user.save()
        redirect_url = self.get_redirect_url()
        if not redirect_url:
            ctx = self.get_context_data()
            return self.render_to_response(ctx)
        return redirect(redirect_url)

    def get_object(self, queryset=None):
        key = self.kwargs['key']
        emailconfirmation = EmailConfirmationHMAC.from_key(key)
        if not emailconfirmation:
            if queryset is None:
                queryset = self.get_queryset()
            try:
                emailconfirmation = queryset.get(key=key.lower())
            except EmailConfirmation.DoesNotExist:
                raise Http404()
        return emailconfirmation

    def get_queryset(self):
        qs = EmailConfirmation.objects.all_valid()
        qs = qs.select_related("email_address__user")
        return qs

    def get_context_data(self, **kwargs):
        ctx = kwargs
        ctx["confirmation"] = self.object
        site = get_current_site(self.request)
        ctx.update({'site': site})
        return ctx

    def get_redirect_url(self):
        return get_adapter(self.request).get_email_confirmation_redirect_url(
            self.request)

