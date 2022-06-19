'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class ProductCategory extends Model {
        static associate(models) {
            this.hasMany(models.Products, {
                foreignKey: "categoryId",
                as: "productDetails"
            });
        }
    }
    ProductCategory.init(
        {
            categoryId: { type: DataTypes.INTEGER, autoIncrement: true, allowNull: false, unique: true, primaryKey: true },
            categoryName: { type: DataTypes.STRING, allowNull: false },
            categoryDesc: { type: DataTypes.STRING, allowNull: true },
            categorySlug: { type: DataTypes.STRING, unique: true },
            isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
        },
        {
            sequelize,
            modelName: 'ProductCategory',
            timestamps: true
        },
    );
    return ProductCategory;
};