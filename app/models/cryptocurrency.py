from .db import db

from .watchlist import association_table

class Cryptocurrency(db.Model):
    __tablename__="cryptocurrency"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    symbol = db.Column(db.String(15), nullable=False)
    price = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'symbol': self.symbol,
            'price': self.price
        }

    transactions = db.relationship("Transaction", back_populates="cryptocurrency")
    portfolio = db.relationship("Portfolio", back_populates="cryptocurrency")
    watchlist = db.relationship("Watchlist", secondary=association_table, back_populates="cryptocurrency")
