'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class Products extends Model { 
        static associate(models) {
			this.belongsTo(models.ProductCategory, {
                foreignKey: "categoryId",
                as: 'categoryDetails'
            });
		}
    }
    Products.init(
        {
            productId: { type: DataTypes.INTEGER, autoIncrement: true, allowNull: false, unique: true, primaryKey: true },
            productName: { type: DataTypes.STRING, allowNull: false },
            productDesc: { type: DataTypes.STRING, allowNull: true },
            productSlug: { type: DataTypes.STRING, unique: true },
            categoryId: { type: DataTypes.INTEGER, allowNull: false },
            isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
        },
        {
            sequelize,
            modelName: 'Products',
            timestamps: true
        },
    );
    return Products;
};