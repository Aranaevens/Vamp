from rest_framework import routers

from VampMasc.viewsets import CampaignViewSet, DisciplineViewSet, AdvantageViewSet, FlawViewSet, PredatorViewSet, \
    CharacterViewSet

router = routers.DefaultRouter()

router.register(r'campaign', CampaignViewSet)
router.register(r'discipline', DisciplineViewSet)
router.register(r'advantage', AdvantageViewSet)
router.register(r'flaw', FlawViewSet)
router.register(r'predator', PredatorViewSet)
router.register(r'char', CharacterViewSet)
