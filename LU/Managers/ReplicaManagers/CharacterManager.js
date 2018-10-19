const GenericManager = require('../GenericManager');
const Components = require('../../Replica/Components');
const SerializationOrder = require('../../Replica/SerializationOrder');
const SerializationType = require('../../Replica/SerializationType');
class CharacterManager extends GenericManager {
    constructor(server) {
        super(server);

        this._data = {};

        // To fix scoping issues inside of callbacks
        let manager = this;

        /**
         * @param {Object} object
         */
        server.eventBus.on('new-object-created', object => {
            if(object.components.hasComponent(Components.CHARACTER_COMPONENT)) {
                manager._data[object.ID.low] = {
                    unknown1: undefined,
                    hasLevel: {
                        level: 1
                    },
                    unknown2: undefined,
                    co: undefined,
                    unknown3: undefined,
                    unknown4: undefined,
                    unknown5: undefined,
                    hairColor: 0,
                    hairStyle: 0,
                    hd: 0,
                    shirtColor: 0,
                    pantsColor: 0,
                    cd: 0,
                    hdc: 0,
                    eyebrows: 0,
                    eyes: 0,
                    mouth: 0,
                    accountID: 0,
                    llog: 0,
                    unknown6: 0,
                    legoScore: 0,
                    freeToPlay: false,
                    totalCurrency: 0,
                    totalBricks: 0,
                    totalSmashables: 0,
                    totalQuickBuilds: 0,
                    totalEnemies: 0,
                    totalRockets: 0,
                    totalMissions: 0,
                    totalPets: 0,
                    totalImagination: 0,
                    totalLife: 0,
                    totalArmor: 0,
                    totalDistanceTravelled: 0,
                    totalTimesSmashed: 0,
                    totalDamageTaken: 0,
                    totalDamageHealed: 0,
                    totalArmorRepaired: 0,
                    totalImaginationRestored: 0,
                    totalImaginationUsed: 0,
                    totalDistanceDriven: 0,
                    totalTimeAirbornDriving: 0,
                    totalRacingImaginationPowerups: 0,
                    totalRacingImaginationCrates: 0,
                    totalRacingBoostUsed: 0,
                    totalRacingWrecks: 0,
                    totalRacingSmashables: 0,
                    totalRacingFinished: 0,
                    totalRacingWins: 0,
                    unknown7: undefined,
                    rocketLanding: undefined,
                    unknown8: {
                        pvp: false,
                        gmlevel: 0,
                        unknown1: false,
                        unknown2: 0,
                    },
                    effect: {
                        id: 0
                    },
                    guild: undefined
                };


                object.addSerializer(SerializationOrder.indexOf(Components.CHARACTER_COMPONENT), (type, stream) => {
                    let data = manager._data[object.ID.low];

                    stream.writeBit(data.unknown1 !== undefined);
                    stream.writeBit(data.hasLevel !== undefined);
                    if(data.hasLevel !== undefined) {
                        stream.writeLong(data.hasLevel.level);
                    }
                    stream.writeBit(data.unknown2 !== undefined);

                    if(type === SerializationType.CREATION) {
                        stream.writeBit(data.co !== undefined);
                        stream.writeBit(data.unknown3 !== undefined);
                        stream.writeBit(data.unknown4 !== undefined);
                        stream.writeBit(data.unknown5 !== undefined);
                        stream.writeLong(data.hairColor);
                        stream.writeLong(data.hairStyle);
                        stream.writeLong(data.hd);
                        stream.writeLong(data.shirtColor);
                        stream.writeLong(data.pantsColor);
                        stream.writeLong(data.cd);
                        stream.writeLong(data.hdc);
                        stream.writeLong(data.eyebrows);
                        stream.writeLong(data.eyes);
                        stream.writeLong(data.mouth);
                        stream.writeLongLong(data.accountID);
                        stream.writeLongLong(data.llog);
                        stream.writeLongLong(data.unknown6);
                        stream.writeLongLong(data.legoScore);
                        stream.writeBit(data.freeToPlay);
                        stream.writeLongLong(data.totalCurrency);
                        stream.writeLongLong(data.totalBricks);
                        stream.writeLongLong(data.totalSmashables);
                        stream.writeLongLong(data.totalQuickBuilds);
                        stream.writeLongLong(data.totalEnemies);
                        stream.writeLongLong(data.totalRockets);
                        stream.writeLongLong(data.totalMissions);
                        stream.writeLongLong(data.totalPets);
                        stream.writeLongLong(data.totalImagination);
                        stream.writeLongLong(data.totalLife);
                        stream.writeLongLong(data.totalArmor);
                        stream.writeLongLong(data.totalDistanceTravelled);
                        stream.writeLongLong(data.totalTimesSmashed);
                        stream.writeLongLong(data.totalDamageTaken);
                        stream.writeLongLong(data.totalDamageHealed);
                        stream.writeLongLong(data.totalArmorRepaired);
                        stream.writeLongLong(data.totalImaginationRestored);
                        stream.writeLongLong(data.totalImaginationUsed);
                        stream.writeLongLong(data.totalDistanceDriven);
                        stream.writeLongLong(data.totalTimeAirbornDriving);
                        stream.writeLongLong(data.totalRacingImaginationPowerups);
                        stream.writeLongLong(data.totalRacingImaginationCrates);
                        stream.writeLongLong(data.totalRacingBoostUsed);
                        stream.writeLongLong(data.totalRacingWrecks);
                        stream.writeLongLong(data.totalRacingFinished);
                        stream.writeLongLong(data.totalRacingWins);
                        stream.writeBit(data.unknown7 !== undefined);
                        stream.writeBit(data.rocketLanding !== undefined);
                    }

                    stream.writeBit(data.unknown8 !== undefined);
                    if(data.unknown8 !== undefined) {
                        stream.writeBit(data.unknown8.pvp);
                        stream.writeBit(data.unknown8.gmlevel > 0);
                        stream.writeByte(data.unknown8.gmlevel);
                        stream.writeBit(data.unknown8.unknown1);
                        stream.writeByte(data.unknown8.unknown2);
                    }
                    stream.writeBit(data.effect !== undefined);
                    if(data.effect !== undefined) {
                        stream.writeLong(data.effect.id);
                    }
                    stream.writeBit(data.guild !== undefined);
                });
            }
        });
    }
}

module.exports = CharacterManager;