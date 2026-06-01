import pytest
from flask import Flask
from database import db as _db

@pytest.fixture
def app():

    test_app= Flask(__name__)
    test_app.config["TESTING"] = True
    test_app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    test_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    _db.init_app(test_app)

    with test_app.app_context():
        _db.create_all()
        yield  test_app
        _db.drop_all()

@pytest.fixture
def db(app):

    return _db
