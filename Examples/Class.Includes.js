var Animal = new Class({
  
  isAnimal: true,
  
  birth: function () {
    output("Start living");
  }
});

var Gem = new Class({
  
  isGem: true,
  
  roll: function () {
    output("Rolling");
  }
});

LivingStone = new Class({
  Includes: [Animal, Gem],
  
  say: function () {
    output("Im living stone");
  }
});

var stone = new LivingStone();

stone.say();
stone.birth();
stone.roll();

seporator();

var BigLivingStone = new Class({
  Includes: [LivingStone, Options],
  
  say: function () {
    output("Im big living stone!");
  }
});

var bigStone = new BigLivingStone();

bigStone.say();
bigStone.roll();
output(typeOf(bigStone.setOptions));