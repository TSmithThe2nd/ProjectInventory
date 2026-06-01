from models.item import Item


def test_to_dict_returns_tags_as_list():
    item = Item(name="Drill", tags="tools,power,cordless")
    result = item.to_dict()

    assert result["tags"] == ["tools", "power", "cordless"]


def test_to_dict_empty_tags_returns_empty_list():
    item = Item(name="lamp", tags="")
    result = item.to_dict()

    assert result["tags"] == []
