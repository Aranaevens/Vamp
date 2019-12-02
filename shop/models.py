from rp_shop import settings
from django.contrib.auth.models import AbstractUser

# Create your models here.
from django.db.models import Model, CharField, TextField, DateField, ForeignKey, SET_NULL, CASCADE, ManyToManyField, \
    ImageField, DateTimeField, IntegerField, BooleanField, EmailField, Avg
from django_enumfield import enum


class CustomUser(AbstractUser):
    username = None
    email = EmailField('email address', unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    wishes = ManyToManyField('Book', related_name="+", verbose_name="Book wished", blank=True)

    def __str__(self):
        return self.email


class Designer(Model):
    name = CharField("Name", max_length=100)
    bio = TextField("Biography", blank=True)

    def __str__(self):
        return self.name


class TagType(Model):
    intitule = CharField('Intitule', max_length=25)
    color = CharField('Color', max_length=7)

    def __str__(self):
        return self.intitule


class Tag(Model):
    name = CharField("Name", max_length=50)
    type = ForeignKey(TagType, on_delete=SET_NULL, null=True, blank=True, related_name="+")

    def __str__(self):
        return self.name


class Game(Model):
    name = CharField("Name", max_length=200)
    # published_at = DateField("Published", null=True, blank=True)
    designer = ForeignKey(Designer, on_delete=SET_NULL, verbose_name="Designer", related_name="games", null=True)
    tags = ManyToManyField(Tag, related_name="games", verbose_name="Tags associated", blank=True)

    def __str__(self):
        return self.name


class Article(Model):
    title = CharField("Name", max_length=200)
    written_at = DateField("Written", auto_now_add=True)
    content = TextField("Content")
    game = ForeignKey(Game, on_delete=CASCADE, verbose_name="Game", related_name="articles", null=True, blank=True)

    def __str__(self):
        return self.title


def get_upload_to(instance, filename):
    return 'upload/%s/%s' % (instance.game, filename)


class Book(Model):
    title = CharField("Name", max_length=200)
    edited_at = DateField("Edited", null=True)
    cover = ImageField(upload_to=get_upload_to, null=True, blank=True)
    highlight = BooleanField(default=False)
    summary = TextField("Summary", blank=True)
    game = ForeignKey(Game, on_delete=CASCADE, verbose_name="Game", related_name="books")
    price = IntegerField(default=50)

    def rating(self):
        return self.comments.aggregate(Avg('rating'))['rating_avg']

    def __str__(self):
        return self.title


class CommentBook(Model):
    user = ForeignKey(settings.AUTH_USER_MODEL, on_delete=SET_NULL, related_name="comments", null=True)
    book = ForeignKey(Book, on_delete=CASCADE, related_name="comments")

    content = TextField("Content", blank=True)
    created_at = DateTimeField("Posted", auto_now=True)
    rating = IntegerField("Rating")
    upvotes = IntegerField("Upvotes", editable=False, default=0)

    def upvoted(self):
        self.upvotes += 1

    def downvoted(self):
        self.upvotes -= 1

    def resetvote(self):
        self.upvotes = 0

    def __str__(self):
        return self.content


class OrderStatus(enum.Enum):
    AWAITING_PAYMENT = 0
    RECEIVED = 1
    PROCESSING = 2
    SHIPPED = 3
    COMPLETE = 4

    _transitions = {
        PROCESSING: (RECEIVED,),
        SHIPPED: (PROCESSING,),
        COMPLETE: (SHIPPED,),
    }


class Order(Model):
    num_cmd = CharField(max_length=12)
    made_at = DateTimeField("Orderer", auto_now=True)
    name = CharField(max_length=155)
    address = CharField(max_length=255)
    zip = CharField(max_length=10)
    status = enum.EnumField(OrderStatus)
    user_from = ForeignKey(settings.AUTH_USER_MODEL, on_delete=SET_NULL, verbose_name="Orderer", null=True, related_name="orders")
    items = ManyToManyField(Book, through='OrdBook', related_name="+", verbose_name="Item ordered")


class OrdBook(Model):
    ord = ForeignKey(Order, on_delete=CASCADE)
    book = ForeignKey(Book, on_delete=CASCADE)

