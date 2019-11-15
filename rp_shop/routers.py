from django.urls import include
from rest_framework import routers

from shop.viewsets import DesignerViewSet, TagViewSet, GameViewSet, ArticleViewSet, BookViewSet, OrderViewSet, \
    CommentViewSet, UserViewSet

router = routers.DefaultRouter()

router.register(r'designer', DesignerViewSet)
router.register(r'tag', TagViewSet)
router.register(r'game', GameViewSet)
router.register(r'article', ArticleViewSet)
router.register(r'book', BookViewSet)
router.register(r'order', OrderViewSet)
router.register(r'comment', CommentViewSet)
router.register(r'user', UserViewSet)
