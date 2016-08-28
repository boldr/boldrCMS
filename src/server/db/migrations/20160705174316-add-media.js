module.exports = {
  up(queryInterface, DataTypes) {
    return queryInterface.createTable(
        'media', {
          id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
          },
          filename: {
            type: DataTypes.STRING(256),
            allowNull: true
          },
          originalname: {
            type: DataTypes.STRING(256),
            allowNull: true
          },
          mimetype: {
            type: DataTypes.STRING(256),
            allowNull: true
          },
          key: {
            type: DataTypes.STRING(256),
            allowNull: true
          },
          categoryId: {
            type: DataTypes.INTEGER,
            field: 'category_id'
          },
          meta: {
            type: DataTypes.JSONB
          },
          size: {
            type: DataTypes.INTEGER
          },
          s3url: {
            type: DataTypes.STRING
          },
          createdAt: {
            type: DataTypes.DATE
          },
          updatedAt: {
            type: DataTypes.DATE
          },
          userId: {
            type: DataTypes.UUID,
            field: 'user_id'
          }
        }
      );
  },

  down(queryInterface) {
    return queryInterface.dropTable('media');
  }
};