from django.contrib.auth.models import User
from django.db import models

# Create your models here.
from django_mysql.models import JSONField


class AppUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)


class Campaign(models.Model):
    name = models.CharField("Name", max_length=100)
    owner = models.ForeignKey(AppUser, on_delete=models.CASCADE, verbose_name="Game master", related_name="campaigns")
    pwd = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Discipline(models.Model):
    name = models.CharField("Name", max_length=100)

    def __str__(self):
        return self.name


class Advantage(models.Model):
    name = models.CharField("Name", max_length=100)

    def __str__(self):
        return self.name


class Flaw(models.Model):
    name = models.CharField("Name", max_length=100)

    def __str__(self):
        return self.name


class Predator(models.Model):
    name = models.CharField("Name", max_length=100)
    advantages = models.ManyToManyField(Advantage, related_name='+', verbose_name="Advantages associated")
    flaws = models.ManyToManyField(Flaw, related_name='+', verbose_name="Flaws associated")
    disciplines = models.ManyToManyField(Discipline, related_name='+', verbose_name="Disciplines offered")

    def __str__(self):
        return self.name


class Clan(models.Model):
    name = models.CharField('Name', max_length=100)
    disciplines = models.ManyToManyField(Discipline, related_name="clans")

    def __str__(self):
        return self.name


class Character(models.Model):
    name = models.CharField("Name", max_length=100)
    stats = JSONField()
    campaign = models.ForeignKey(Campaign, related_name="characters", on_delete=models.SET_NULL,
                                 verbose_name="Campaign related", null=True)
    player = models.ForeignKey(AppUser, related_name="characters", on_delete=models.CASCADE,
                               verbose_name="Character's player account")
    clan = models.ForeignKey(Clan, related_name="characters", on_delete=models.PROTECT, verbose_name="Character's clan",
                             null=True)
    predator = models.ForeignKey(Predator, related_name="characters", on_delete=models.PROTECT,
                                 verbose_name="Character's Predator", null=True)
    disciplines = models.ManyToManyField(Discipline, through='DisciplineCharacter', related_name="characters")
    advantages = models.ManyToManyField(Advantage, related_name="characters")
    flaws = models.ManyToManyField(Flaw, related_name="characters")

    def __str__(self):
        return self.name


class DisciplineCharacter(models.Model):
    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE)
    character = models.ForeignKey(Character, on_delete=models.CASCADE)

    nb_dots = models.PositiveIntegerField()
    is_clan = models.BooleanField()


