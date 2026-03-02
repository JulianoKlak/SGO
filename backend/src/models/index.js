'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import model definitions
const ClientModel = require('./Client');
const VehicleModel = require('./Vehicle');
const UserModel = require('./User');
const ProductModel = require('./Product');
const ServiceModel = require('./Service');
const InventoryModel = require('./Inventory');
const ServiceOrderModel = require('./ServiceOrder');
const StageModel = require('./Stage');
const TaskModel = require('./Task');
const ServiceOrderProductModel = require('./ServiceOrderProduct');
const ServiceOrderServiceModel = require('./ServiceOrderService');
const TaskCommentModel = require('./TaskComment');
const TaskImageModel = require('./TaskImage');
const SystemInfoModel = require('./SystemInfo');

// Initialize models
const Client = ClientModel(sequelize, DataTypes);
const Vehicle = VehicleModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const Product = ProductModel(sequelize, DataTypes);
const Service = ServiceModel(sequelize, DataTypes);
const Inventory = InventoryModel(sequelize, DataTypes);
const ServiceOrder = ServiceOrderModel(sequelize, DataTypes);
const Stage = StageModel(sequelize, DataTypes);
const Task = TaskModel(sequelize, DataTypes);
const ServiceOrderProduct = ServiceOrderProductModel(sequelize, DataTypes);
const ServiceOrderService = ServiceOrderServiceModel(sequelize, DataTypes);
const TaskComment = TaskCommentModel(sequelize, DataTypes);
const TaskImage = TaskImageModel(sequelize, DataTypes);
const SystemInfo = SystemInfoModel(sequelize, DataTypes);

// ── Associations ─────────────────────────────────────────────────────────────

// Client ↔ Vehicle
Client.hasMany(Vehicle, { foreignKey: 'client_id', as: 'vehicles' });
Vehicle.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

// Client ↔ ServiceOrder
Client.hasMany(ServiceOrder, { foreignKey: 'client_id', as: 'serviceOrders' });
ServiceOrder.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

// Vehicle ↔ ServiceOrder
Vehicle.hasMany(ServiceOrder, { foreignKey: 'vehicle_id', as: 'serviceOrders' });
ServiceOrder.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

// User ↔ ServiceOrder
User.hasMany(ServiceOrder, { foreignKey: 'user_id', as: 'serviceOrders' });
ServiceOrder.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ServiceOrder ↔ Stage
ServiceOrder.hasMany(Stage, { foreignKey: 'service_order_id', as: 'stages' });
Stage.belongsTo(ServiceOrder, { foreignKey: 'service_order_id', as: 'serviceOrder' });

// Stage ↔ Task
Stage.hasMany(Task, { foreignKey: 'stage_id', as: 'tasks' });
Task.belongsTo(Stage, { foreignKey: 'stage_id', as: 'stage' });

// User ↔ Task (mechanic assigned)
User.hasMany(Task, { foreignKey: 'user_id', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'user_id', as: 'mechanic' });

// Task ↔ TaskComment
Task.hasMany(TaskComment, { foreignKey: 'task_id', as: 'comments' });
TaskComment.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

// User ↔ TaskComment
User.hasMany(TaskComment, { foreignKey: 'user_id', as: 'taskComments' });
TaskComment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

// Task ↔ TaskImage
Task.hasMany(TaskImage, { foreignKey: 'task_id', as: 'images' });
TaskImage.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

// User ↔ TaskImage
User.hasMany(TaskImage, { foreignKey: 'user_id', as: 'taskImages' });
TaskImage.belongsTo(User, { foreignKey: 'user_id', as: 'uploader' });

// ServiceOrder ↔ ServiceOrderProduct
ServiceOrder.hasMany(ServiceOrderProduct, { foreignKey: 'service_order_id', as: 'orderProducts' });
ServiceOrderProduct.belongsTo(ServiceOrder, { foreignKey: 'service_order_id', as: 'serviceOrder' });

// Product ↔ ServiceOrderProduct
Product.hasMany(ServiceOrderProduct, { foreignKey: 'product_id', as: 'orderProducts' });
ServiceOrderProduct.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// ServiceOrder ↔ ServiceOrderService
ServiceOrder.hasMany(ServiceOrderService, { foreignKey: 'service_order_id', as: 'orderServices' });
ServiceOrderService.belongsTo(ServiceOrder, { foreignKey: 'service_order_id', as: 'serviceOrder' });

// Service ↔ ServiceOrderService
Service.hasMany(ServiceOrderService, { foreignKey: 'service_id', as: 'orderServices' });
ServiceOrderService.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

// Product ↔ Inventory
Product.hasMany(Inventory, { foreignKey: 'product_id', as: 'inventoryRecords' });
Inventory.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = {
  sequelize,
  Sequelize,
  Client,
  Vehicle,
  User,
  Product,
  Service,
  Inventory,
  ServiceOrder,
  Stage,
  Task,
  ServiceOrderProduct,
  ServiceOrderService,
  TaskComment,
  TaskImage,
  SystemInfo,
};
