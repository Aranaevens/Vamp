from django.urls import include
from rest_framework import routers

from VampMasc.viewsets import CampaignViewSet, DisciplineViewSet, AdvantageViewSet, FlawViewSet, PredatorViewSet, \
    CharacterViewSet, AppUserViewSet

router = routers.DefaultRouter()

router.register(r'campaign', CampaignViewSet)
router.register(r'discipline', DisciplineViewSet)
router.register(r'advantage', AdvantageViewSet)
router.register(r'flaw', FlawViewSet)
router.register(r'predator', PredatorViewSet)
router.register(r'char', CharacterViewSet)
router.register(r'user', AppUserViewSet)
