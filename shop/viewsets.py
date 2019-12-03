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
        elif self.action == 'post_comment':
            return CommentSerializer
        else:
            return BookDetailSerializer

    @action(detail=True, methods=['get'])
    def is_a_wish(self, request, pk=None):
        user = request.user
        if user.wishes.all().filter(pk=pk).exists():
            return Response(data={'message':True})
        else:
            return Response(data={'message':False})

    @action(detail=True, methods=['get'])
    def make_a_wish(self, request, pk=None):
        user = request.user
        book = self.get_object()
        if book:
            user.wishes.add(book)
            user.save()
            return Response(data={'message':True})
        else:
            return Response(data={'message':False})

    @action(detail=True, methods=['get'])
    def remove_a_wish(self, request, pk=None):
        user = request.user
        book = self.get_object()
        if user.wishes.all().filter(pk=pk).exists():
            user.wishes.remove(book)
            user.save()
            return Response(data={'message':True})
        else:
            return Response(data={'message':False})

    @action(detail=True, methods=['get'])
    def load_comments(self, request, pk=None):
        book = self.get_object()
        queryset = CommentBook.objects.filter(book=book.pk)
        serializer = CommentSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def post_comment(self, request, pk=None):
        book = self.get_object()
        user = request.user
        complete_data = request.data
        complete_data['user'] = user.pk
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save()
            book.comments.add(comment)
            return Response(data={'message':True})
        else:
            return Response(data={'message':"Wrong data input"})


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

