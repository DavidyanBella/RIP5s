from django.shortcuts import render

artifacts = [
    {
        "id": 1,
        "name": "Пограничная стела",
        "description": "Одним из самых известных являются пограничные стелы Ахетатона. Они были сделаны примерно на 6 году правления Эхнатона. Эти стелы были высечены на отвесных скалах, которые служили естественной границей города. На верхней части стелы изображали поклонение фараона и его семьи Атону. В нижней части находился текст об основании самой столицы и клятва фараона никогда её не покидать. Далее шли размеры территории города и перечислялось всё то, что планировалось построить. Так сказать планы на будущее вырезанные в камне. Туда вошёл перечень храмов, дворцов и гробниц.",
        "category": "Стелы",
        "image": "http://localhost:9000/images/1.png"
    },
    {
        "id": 2,
        "name": "Пограничная стела в Туна-эль-Гебель",
        "description": "На каждой стеле по центру изображали солнечный диск. Эхнатон и Нефертити протягивают к нему свои руки. Вокруг них надписи с именами и титулами Атона, Эхнатона, Нефертити и их дочерей. Хотя там указано новое имя царицы Нефер-Нефру-Атон, но я буду писать Нефертити, потому что под первым своим именем она известна гораздо больше.",
        "category": "Стелы",
        "image": "http://localhost:9000/images/2.png"
    },
    {
        "id": 3,
        "name": "Эхнатон и Нефертити",
        "description": "В искусстве также появляются новые сюжеты. Впервые можно увидеть какие-то интимные сцены из быта фараона. Например, когда Эхнатон сидит на табурете с мягкой подушкой, а напротив него на таком же табурете сидит Нефертити.",
        "category": "Рельефы",
        "image": "http://localhost:9000/images/3.png"
    },
    {
        "id": 4,
        "name": "Скульптура Эхнатона",
        "description": "«Удлинённый овал лица Эхнатона с толстыми губами и отвислым подбородком, выгнутая худая шея, резко обозначенные ключицы, пухлый живот, хилые ноги с чрезмерно полными бёдрами и очень тонкими щиколотками» — вот так описывают скульптуры Эхнатона. Они ведь действительно отличаются от всего того, что было принято создавать в Древнем Египте. Никакой идеализации, даже наоборот, утрирование реальных форм. Подобный стиль изображений встречается у памятников, рельефов и скульптур, которые относятся только к первым пяти годам правления Эхнатона.",
        "category": "Скульптуры",
        "image": "http://localhost:9000/images/4.png"
    },
    {
        "id": 5,
        "name": "Бюст Нефертити",
        "description": "Как его описывает Матье: «Перед нами лицо молодой женщины с нежным овалом, небольшим ртом, тяжёлыми веками, слегка прикрывающими глаза. На её голове надет высокий головной убор, который носили царицы в конце XVIII династии, и кажется, что тонкая шея слишком хрупка для такой тяжести. Золотая с цветными вставками повязка обвивает этот убор, пёстрое ожерелье обрамляет плечи».",
        "category": "Скульптуры",
        "image": "http://localhost:9000/images/5.png"
    },
    {
        "id": 6,
        "name": "Гробница Ахмеса",
        "description": "Чаще всего новые идеи и веяния отражались и демонстрировались в рельефах гробниц. И это даёт очень обширный материал для изучения. Именно по ним мы можем судить не только о самом развитии искусства, но и о том, как выглядели архитектурные сооружения.",
        "category": "Гробницы",
        "image": "http://localhost:9000/images/6.png"
    }
]

draft_artwork = {
    "id": 123,
    "status": "Черновик",
    "date_created": "12 сентября 2024г",
    "artifacts": [
        {
            "id": 1,
            "value": "1350г до н.э"
        },
        {
            "id": 2,
            "value": "1437г до н.э"
        },
        {
            "id": 3,
            "value": "1311г до н.э"
        }
    ]
}


def getArtifactById(artifact_id):
    for artifact in artifacts:
        if artifact["id"] == artifact_id:
            return artifact


def getArtifacts():
    return artifacts


def searchArtifacts(artifact_name):
    res = []

    for artifact in artifacts:
        if artifact_name.lower() in artifact["name"].lower():
            res.append(artifact)

    return res


def getDraftArtwork():
    return draft_artwork


def getArtworkById(artwork_id):
    return draft_artwork


def index(request):
    artifact_name = request.GET.get("artifact_name", "")
    artifacts = searchArtifacts(artifact_name) if artifact_name else getArtifacts()
    draft_artwork = getDraftArtwork()

    context = {
        "artifacts": artifacts,
        "artifact_name": artifact_name,
        "artifacts_count": len(draft_artwork["artifacts"]),
        "draft_artwork": draft_artwork
    }

    return render(request, "home_page.html", context)


def artifact(request, artifact_id):
    context = {
        "id": artifact_id,
        "artifact": getArtifactById(artifact_id),
    }

    return render(request, "artifact_page.html", context)


def artwork(request, artwork_id):
    artwork = getArtworkById(artwork_id)
    artifacts = [
        {**getArtifactById(artifact["id"]), "value": artifact["value"]}
        for artifact in artwork["artifacts"]
    ]

    context = {
        "artwork": artwork,
        "artifacts": artifacts
    }

    return render(request, "artwork_page.html", context)
