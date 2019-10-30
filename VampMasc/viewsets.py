from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from VampMasc.models import Campaign, Discipline, Character, Predator, Flaw, Advantage
from VampMasc.serializers import CampaignSerializer, DisciplineSerializer, CharacterSerializer, PredatorSerializer, \
    FlawSerializer, AdvantageSerializer


class CampaignViewSet(ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.owner == request.user or request.user.is_staff():
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class DisciplineViewSet(ReadOnlyModelViewSet):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer
    permission_classes = [IsAuthenticated]


class AdvantageViewSet(ModelViewSet):
    queryset = Advantage.objects.all()
    serializer_class = AdvantageSerializer
    permission_classes = [IsAuthenticated]


class FlawViewSet(ModelViewSet):
    queryset = Flaw.objects.all()
    serializer_class = FlawSerializer
    permission_classes = [IsAuthenticated]


class PredatorViewSet(ReadOnlyModelViewSet):
    queryset = Predator.objects.all()
    serializer_class = PredatorSerializer
    permission_classes = [IsAuthenticated]


class CharacterViewSet(ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.owner == request.user or request.user.is_staff():
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

