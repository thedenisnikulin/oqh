import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';

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

interface IUser extends Model {
    readonly id: string;
    readonly username: string;
    readonly password: string;
    readonly bio: string;
    readonly rep: number;
    readonly isSearching: boolean;
    readonly roomId: string | null;

    readonly createdAt: Date;
    readonly updatedAt: Date;
};

interface IRoom extends Model {
    readonly id: string;
    readonly topic: string;

    readonly createdAt: Date;
    readonly updatedAt: Date;

    readonly users?: Array<IUser>;
    readonly chatMessages?: Array<IChatMessage>
};

interface IChatMessage extends Model {
    readonly id: string;
    readonly message: string;
    readonly senderId: string;
    readonly roomId: string;

    readonly createdAt: Date;
    readonly updatedAt: Date;

    readonly user: IUser;
    readonly room: IRoom;
};

type UserModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IUser;
};
type RoomModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IRoom;
};
type ChatMessageModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IChatMessage;
};

const User = <UserModelStatic>sequelize.define('user', {
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
    freezeTableName: true
});

const Room = <RoomModelStatic>sequelize.define('room', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    topic: {
        type: DataTypes.STRING,
    }
}, {
    freezeTableName: true
});

const ChatMessage = <ChatMessageModelStatic>sequelize.define('chatMessage', {
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
    freezeTableName: true
});

(async () => {
    const variable = await User.findOne({ where: {
        username: 'test1'
        }
    });
    const r = await Room.findOne({ where: {
        topic: 'music'
    } });
    const m: Array<IChatMessage> = await ChatMessage.findAll();
    console.log(variable)
    console.log(r);
    if (m !== null) {
        m.map(h => {
            console.log(h.message)
        });
    }
})()
