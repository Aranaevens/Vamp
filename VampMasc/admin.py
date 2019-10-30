from django.contrib import admin

# Register your models here.
from django.contrib.auth.models import User

from VampMasc.models import AppUser, Campaign, Discipline, Advantage, Flaw, Predator, Clan, Character, \
    DisciplineCharacter

admin.site.register(AppUser)
admin.site.register(Campaign)
admin.site.register(Discipline)
admin.site.register(Advantage)
admin.site.register(Flaw)
admin.site.register(Predator)
admin.site.register(Clan)
admin.site.register(Character)
admin.site.register(DisciplineCharacter)
