from django.contrib.auth.models import User
from django.db import connection
from django.shortcuts import render, redirect
from django.utils import timezone

from app.models import Person, Artwork, PersonArtwork


def index(request):
    person_name = request.GET.get("person_name", "")
    persons = Person.objects.filter(status=1)

    if person_name:
        persons = persons.filter(name__icontains=person_name)

    draft_artwork = get_draft_artwork()

    context = {
        "person_name": person_name,
        "persons": persons
    }

    if draft_artwork:
        context["persons_count"] = len(draft_artwork.get_persons())
        context["draft_artwork"] = draft_artwork

    return render(request, "persons_page.html", context)


def add_person_to_draft_artwork(request, person_id):
    person = Person.objects.get(pk=person_id)

    draft_artwork = get_draft_artwork()

    if draft_artwork is None:
        draft_artwork = Artwork.objects.create()
        draft_artwork.owner = get_current_user()
        draft_artwork.date_created = timezone.now()
        draft_artwork.save()

    if PersonArtwork.objects.filter(artwork=draft_artwork, person=person).exists():
        return redirect("/")

    item = PersonArtwork(
        artwork=draft_artwork,
        person=person
    )
    item.save()

    return redirect("/")


def person_details(request, person_id):
    context = {
        "person": Person.objects.get(id=person_id)
    }

    return render(request, "person_page.html", context)


def delete_artwork(request, artwork_id):
    if not Artwork.objects.filter(pk=artwork_id).exists():
        return redirect("/")

    with connection.cursor() as cursor:
        cursor.execute("UPDATE artworks SET status=5 WHERE id = %s", [artwork_id])

    return redirect("/")


def artwork(request, artwork_id):
    if not Artwork.objects.filter(pk=artwork_id).exists():
        return redirect("/")

    artwork = Artwork.objects.get(id=artwork_id)
    if artwork.status == 5:
        return redirect("/")

    context = {
        "artwork": artwork,
    }

    return render(request, "artwork_page.html", context)


def get_draft_artwork():
    return Artwork.objects.filter(status=1).first()


def get_current_user():
    return User.objects.filter(is_superuser=False).first()