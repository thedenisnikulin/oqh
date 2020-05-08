import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
import {
    Association, 
    HasManyGetAssociationsMixin, 
    HasManyAddAssociationMixin, 
    HasManyHasAssociationMixin, 
    HasManyCountAssociationsMixin, 
    HasManyCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    BelongsToCreateAssociationMixin
} from 'sequelize';

const sequelize: Sequelize = new Sequelize(
    'dev_db', 
    'postgres', 
    'ReAapJJdm0', {
      host: 'localhost',
      dialect: 'postgres',
      pool: {
        max: 9,
        min: 0,
        idle: 10000
      }
  }
);

class User extends Model {
    public id!: string;
    public username!: string;
    public password!: string;
    public bio!: string;
    public rep!: number;
    public isSearching!: boolean;
    public roomId!: string | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getChatMessages!: HasManyGetAssociationsMixin<ChatMessage>; 
    public addChatMessages!: HasManyAddAssociationMixin<ChatMessage, number>;
    public hasChatMessages!: HasManyHasAssociationMixin<ChatMessage, number>;
    public countChatMessages!: HasManyCountAssociationsMixin;
    public createChatMessages!: HasManyCreateAssociationMixin<ChatMessage>;

    public readonly chatMessages?: Array<ChatMessage>;

    public static associations: {
        chatMessages: Association<User, ChatMessage>;
      };
};

class Room extends Model {
    public id!: string;
    public topic!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getUsers!: HasManyGetAssociationsMixin<User>; 
    public addUsers!: HasManyAddAssociationMixin<User, number>;
    public hasUsers!: HasManyHasAssociationMixin<User, number>;
    public countUsers!: HasManyCountAssociationsMixin;
    public createUsers!: HasManyCreateAssociationMixin<User>;

    public getChatMessages!: HasManyGetAssociationsMixin<ChatMessage>; 
    public addChatMessages!: HasManyAddAssociationMixin<ChatMessage, number>;
    public hasChatMessages!: HasManyHasAssociationMixin<ChatMessage, number>;
    public countChatMessages!: HasManyCountAssociationsMixin;
    public createChatMessages!: HasManyCreateAssociationMixin<ChatMessage>;

    public readonly users?: Array<User>;
    public readonly chatMessages?: Array<ChatMessage>
};

class ChatMessage extends Model {
    public id!: string;
    public message!: string;
    public senderId!: string;
    public roomId!: string;

    public getUser!: BelongsToGetAssociationMixin<User>;
    public createUser!: BelongsToCreateAssociationMixin<User>;
    public getRoom!: BelongsToGetAssociationMixin<Room>;
    public createRoom!: BelongsToCreateAssociationMixin<Room>;

    public readonly user?: User;
    public readonly room?: Room;
};

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bio: {
        type: DataTypes.STRING,
    },
    rep: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
    },
    isSearching: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    roomId: {
        type: DataTypes.UUID
    }
}, {
    tableName: 'user',
    sequelize: sequelize
});

Room.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    topic: {
        type: DataTypes.STRING,
    }
}, {
    tableName: 'room',
    sequelize: sequelize
});

ChatMessage.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senderId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    roomId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    tableName: 'chatMessage',
    sequelize: sequelize
});

Room.hasMany(User, { foreignKey: 'roomId' });
Room.hasMany(ChatMessage, { foreignKey: 'roomId' });
User.hasMany(ChatMessage, { foreignKey: 'senderId' });
ChatMessage.belongsTo(User);
ChatMessage.belongsTo(Room);

(async () => {
    try { 
        const room: Room = await Room.create({
            topic: 'hello'
        });
         console.log(room.topic)
     } catch(e) {
         console.log(e)
     }
})();