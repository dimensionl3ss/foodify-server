// constructor

const Dishes = function(Dish) {
    this.name = Dish.name;
    this.description = Dish.description;
    this.image = Dish.image;
    this.price = Dish.price;
    this.featured = Dish.featured;
  };

module.exports = Dishes;