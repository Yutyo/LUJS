import * as Sequelize from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'ItemComponent',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      equipLocation: {
        type: Sequelize.TEXT
      },
      baseValue: {
        type: Sequelize.INTEGER
      },
      isKitPiece: {
        type: Sequelize.BOOLEAN
      },
      rarity: {
        type: Sequelize.INTEGER
      },
      itemType: {
        type: Sequelize.INTEGER
      },
      itemInfo: {
        type: Sequelize.INTEGER
      },
      inLootTable: {
        type: Sequelize.BOOLEAN
      },
      inVendor: {
        type: Sequelize.BOOLEAN
      },
      isUnique: {
        type: Sequelize.BOOLEAN
      },
      isBOP: {
        type: Sequelize.BOOLEAN
      },
      isBOE: {
        type: Sequelize.BOOLEAN
      },
      reqFlagID: {
        type: Sequelize.INTEGER
      },
      reqSpecialtyID: {
        type: Sequelize.INTEGER
      },
      reqSpecRank: {
        type: Sequelize.INTEGER
      },
      reqAchievementID: {
        type: Sequelize.INTEGER
      },
      stackSize: {
        type: Sequelize.INTEGER
      },
      color1: {
        type: Sequelize.INTEGER
      },
      decal: {
        type: Sequelize.INTEGER
      },
      offsetGroupID: {
        type: Sequelize.INTEGER
      },
      buildTypes: {
        type: Sequelize.INTEGER
      },
      reqPrecondition: {
        type: Sequelize.TEXT
      },
      animationFlag: {
        type: Sequelize.INTEGER
      },
      equipEffects: {
        type: Sequelize.INTEGER
      },
      readyForQA: {
        type: Sequelize.BOOLEAN
      },
      itemRating: {
        type: Sequelize.INTEGER
      },
      isTwoHanded: {
        type: Sequelize.BOOLEAN
      },
      minNumRequired: {
        type: Sequelize.INTEGER
      },
      delResIndex: {
        type: Sequelize.INTEGER
      },
      currencyLOT: {
        type: Sequelize.INTEGER
      },
      altCurrencyCost: {
        type: Sequelize.INTEGER
      },
      subItems: {
        type: Sequelize.TEXT
      },
      audioEventUse: {
        type: Sequelize.TEXT
      },
      noEquipAnimation: {
        type: Sequelize.BOOLEAN
      },
      commendationLOT: {
        type: Sequelize.INTEGER
      },
      commendationCost: {
        type: Sequelize.INTEGER
      },
      audioEquipMetaEventSet: {
        type: Sequelize.TEXT
      },
      currencyCosts: {
        type: Sequelize.TEXT
      },
      ingredientInfo: {
        type: Sequelize.TEXT
      },
      locStatus: {
        type: Sequelize.INTEGER
      },
      forgeType: {
        type: Sequelize.INTEGER
      },
      SellMultiplier: {
        type: Sequelize.FLOAT
      }
    },
    {
      timestamps: false,
      tableName: 'ItemComponent'
    }
  );
};
