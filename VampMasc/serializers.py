from django.contrib.auth.models import User
from django.shortcuts import get_list_or_404
from rest_framework.fields import ReadOnlyField
from rest_framework.generics import get_object_or_404
from rest_framework.serializers import ModelSerializer, HyperlinkedModelSerializer

from VampMasc.models import Campaign, Discipline, Advantage, Flaw, Predator, Clan, DisciplineCharacter, Character


class UserSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff']


class CampaignSerializer(ModelSerializer):
    owner = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Campaign
        fields = ['name', 'owner']


class DisciplineSerializer(ModelSerializer):
    class Meta:
        model = Discipline
        fields = ['name']


class AdvantageSerializer(ModelSerializer):
    class Meta:
        model = Advantage
        fields = ['name']


class FlawSerializer(ModelSerializer):
    class Meta:
        model = Flaw
        fields = ['name']


class PredatorSerializer(ModelSerializer):
    advantages = AdvantageSerializer(many=True, read_only=True, allow_null=True)
    flaws = FlawSerializer(many=True, read_only=True, allow_null=True)
    disciplines = DisciplineSerializer(many=True, read_only=True, allow_null=True)

    class Meta:
        model = Predator
        fields = ['name', 'advantages', 'flaws', 'disciplines']

    def create(self, validated_data):
        adv_l = []
        fla_l = []
        dis_l = []
        if 'advantages' in validated_data:
            for advantage in validated_data.pop('advantages'):
                adv = get_object_or_404(Advantage, name=advantage['name'])
                adv_l.append(adv)
        if 'flaws' in validated_data:
            for flaw in validated_data.pop('flaws'):
                fla = get_object_or_404(Flaw, name=flaw['name'])
                fla_l.append(fla)
        if 'disciplines' in validated_data:
            for discipline in validated_data.pop('disciplines'):
                dis = get_object_or_404(Discipline, name=discipline['name'])
                dis_l.append(dis)
        pred = Predator(name=validated_data['name'])
        pred.save()
        for a in adv_l:
            pred.advantages.add(a)
        for f in fla_l:
            pred.flaws.add(f)
        for d in dis_l:
            pred.disciplines.add(d)

        return pred

    def update(self, instance, validated_data):
        for k, v in validated_data.items():
            setattr(instance, k, v)
        instance.save()
        return instance



class ClanSerializer(ModelSerializer):
    disciplines = DisciplineSerializer(many=True, read_only=True, allow_null=True)

    class Meta:
        model = Clan
        fields = ['name', 'disciplines']


class DiscCharSerializer(HyperlinkedModelSerializer):
    id = ReadOnlyField(source='discipine.id')
    name = ReadOnlyField(source='discipline.name')

    class Meta:
        model = DisciplineCharacter
        fields = ['id', 'name', 'nb_dots', 'is_clan']


class CharacterSerializer(ModelSerializer):
    disc = DiscCharSerializer(many=True, read_only=True, allow_null=True)
    campaign = CampaignSerializer(many=False, read_only=True, allow_null=True)
    player = UserSerializer(many=False, read_only=True, allow_null=True)
    clan = ClanSerializer(many=False, read_only=True, allow_null=True)
    pred = PredatorSerializer(many=False, read_only=True, allow_null=True)
    advs = AdvantageSerializer(many=True, read_only=True, allow_null=True)
    flaws = FlawSerializer(many=True, read_only=True, allow_null=True)

    class Meta:
        model = Character
        fields = ['name', 'stats', 'disc', 'player', 'campaign', 'clan', 'pred', 'advs', 'flaws']
