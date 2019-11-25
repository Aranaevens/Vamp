from django.contrib.auth.models import User
from django.db.models import Avg
from rest_framework import status, viewsets, mixins
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from shop.models import Designer, CustomUser, Tag, Game, Article, Book, CommentBook, Order
from shop.serializers import UserSerializer, TagSerializer, DesignerSerializer, GameSerializer, ArticleSerializer, \
    BookDetailSerializer, CommentSerializer, OrderSerializer, BookListSerializer


class UserViewSet(ReadOnlyModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    @action(detail=True, methods=['get'], url_path='(?P<bid>\d+)')
    def is_a_wish(self, request, pk=None, bid=None):
        user = self.get_object()
        if user.wishes.all().filter(pk=bid).exists():
            return Response(data={'message':True})
        else:
            return Response(data={'message':False})


class DesignerViewSet(ReadOnlyModelViewSet):
    queryset = Designer.objects.all()
    serializer_class = DesignerSerializer


class TagViewSet(ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class GameViewSet(ReadOnlyModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class ArticleViewSet(ReadOnlyModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer


class BookViewSet(ReadOnlyModelViewSet):
    queryset = Book.objects.all()

    def get_queryset(self):
        return self.queryset.annotate(rating=Avg('comments__rating'))

    def get_serializer_class(self):
        if self.action == 'list':
            return BookListSerializer
        else:
            return BookDetailSerializer

    @action(detail=True, methods=['get'])
    def is_a_wish(self, request, pk=None):
        user = request.user
        if user.wishes.all().filter(pk=pk).exists():
            return Response(data={'message':True})
        else:
            return Response(data={'message':False})


class OrderViewSet( mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.CreateModelMixin,
                    viewsets.GenericViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class CommentViewSet(ModelViewSet):
    queryset = CommentBook.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.owner == request.user or request.user.is_staff():
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

