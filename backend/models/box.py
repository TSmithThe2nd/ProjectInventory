from datetime import date
from database import db


class Box(db.Model):
    __tablename__ = 'boxes'

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, default='')
    location    = db.Column(db.String(300), default='')
    created_at  = db.Column(db.String(20), default=lambda: str(date.today()))

    items = db.relationship('Item', backref='box', lazy=True)

    def to_dict(self, include_items=False):
        d = {
            'id':          self.id,
            'name':        self.name,
            'description': self.description,
            'location':    self.location,
            'created_at':  self.created_at,
            'item_count':  len(self.items),
        }
        if include_items:
            d['items'] = [i.to_dict() for i in self.items]
        return d
