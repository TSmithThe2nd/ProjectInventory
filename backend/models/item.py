from datetime import date
from database import db


class Item(db.Model):
    __tablename__ = 'items'

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, default='')
    quantity    = db.Column(db.Integer, default=0)
    unit        = db.Column(db.String(50), default='')
    location    = db.Column(db.String(300), default='')
    tags        = db.Column(db.Text, default='')   # comma-separated string
    notes       = db.Column(db.Text, default='')
    photo_url   = db.Column(db.String(500), nullable=True)
    date_added  = db.Column(db.String(20), default=lambda: str(date.today()))
    added_by    = db.Column(db.String(100), default='')
    box_id      = db.Column(db.Integer, db.ForeignKey('boxes.id'), nullable=True)

    def to_dict(self):
        return {
            'id':          self.id,
            'name':        self.name,
            'description': self.description,
            'quantity':    self.quantity,
            'unit':        self.unit,
            'location':    self.location,
            'tags':        [t.strip() for t in self.tags.split(',') if t.strip()],
            'notes':       self.notes,
            'photo_url':   self.photo_url,
            'date_added':  self.date_added,
            'added_by':    self.added_by,
            'box_id':      self.box_id,
            'box_name':    self.box.name if self.box else None,
        }