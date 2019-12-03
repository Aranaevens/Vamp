from rest_framework.fields import ReadOnlyField, CharField, EmailField
from rest_framework.serializers import ModelSerializer

from shop.models import Designer, \
    Game, Tag, Article, Book, CommentBook, Order, OrdBook, CustomUser
from rest_auth.registration.serializers import RegisterSerializer


class CustomRegisterSerializer(RegisterSerializer):
    email = EmailField(required=True)
    password1 = CharField(write_only=True)
    password2 = CharField(write_only=True)

    def get_cleaned_data(self):
        super(CustomRegisterSerializer, self).get_cleaned_data()

        return {
            'password1': self.validated_data.get('password1', ''),
            'password2': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
        }


class DesignerSerializer(ModelSerializer):
    class Meta:
        model = Designer
        fields = ['name', 'bio']


class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name']


class GameSerializer(ModelSerializer):
    # designer = ReadOnlyField(source='designer.name')
    designer = DesignerSerializer(many=False, allow_null=True, read_only=True)
    tags = TagSerializer(many=True, allow_null=True, read_only=True)

    class Meta:
        model = Game
        fields = ['name', 'designer', 'tags']


class ArticleSerializer(ModelSerializer):
    game = GameSerializer(many=False, allow_null=True, read_only=True)

    class Meta:
        model = Article
        fields = ['id', 'title', 'written_at', 'content', 'game']


class BookDetailSerializer(ModelSerializer):
    game = GameSerializer(many=False, allow_null=True, read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'title', 'edited_at', 'cover', 'game', 'summary', 'price', 'rating']
        read_only_fields = ['rating']


class BookListNoRatingSerializer(ModelSerializer):

    class Meta:
        model = Book
        fields = ['id', 'title', 'cover']


class BookListSerializer(ModelSerializer):
    game = ReadOnlyField(source='game.name')
    game_id = ReadOnlyField(source='game.id')
    tags = TagSerializer(many=True, allow_null=True, read_only=True, source='game.tags')

    class Meta:
        model = Book
        fields = ['id', 'title', 'edited_at', 'cover', 'game', 'tags', 'game_id', 'rating', 'price']
        read_only_fields = ['rating']


class UserSerializer(ModelSerializer):
    wishes = BookListNoRatingSerializer(many=True, allow_null=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'wishes']


class CommentSerializer(ModelSerializer):

    class Meta:
        model = CommentBook
        fields = ['content', 'created_at', 'rating', 'upvotes', 'user', 'book']


class OrdBookSerializer(ModelSerializer):
    id = ReadOnlyField(source='book.id')

    class Meta:
        model = OrdBook
        fields = ['id']


class OrderSerializer(ModelSerializer):
    user = UserSerializer(many=False, allow_null=True, read_only=True)
    books = OrdBookSerializer(many=True, allow_null=False, read_only=True)

    class Meta:
        model = Order
        fields = ['num_cmd', 'made_at', 'name', 'address', 'zip', 'status', 'user', 'books']

