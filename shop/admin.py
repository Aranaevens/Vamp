from django.contrib import admin

# Register your models here.
from django.contrib.auth.models import User

from shop.models import OrdBook, Order, CommentBook, Book, Article, Game, Tag, Designer, CustomUser, TagType

admin.site.register(CustomUser)
admin.site.register(Designer)
admin.site.register(Tag)
admin.site.register(TagType)
admin.site.register(Game)
admin.site.register(Article)
admin.site.register(Book)
admin.site.register(CommentBook)
admin.site.register(Order)
admin.site.register(OrdBook)
