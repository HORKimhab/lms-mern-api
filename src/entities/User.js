import { EntitySchema } from 'typeorm';

const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true, // auto increment
    },

    // 🔹 Basic Info
    userName: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    userEmail: {
      type: 'varchar',
      length: 150,
      unique: true,
      nullable: false,
    },
    password: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },

    // 🔹 Optional profile fields
    fullName: {
      type: 'varchar',
      length: 150,
      nullable: true,
    },
    avatar: {
      type: 'varchar',
      length: 255,
      nullable: true,
      comment: 'Profile image URL',
    },
    phoneNumber: {
      type: 'varchar',
      length: 20,
      nullable: true,
    },

    // 🔹 User roles and status
    role: {
      type: 'enum',
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },
    status: {
      type: 'enum',
      enum: ['active', 'inactive', 'banned'],
      default: 'active',
    },

    // 🔹 Timestamps
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
    },
  },

  // 🔹 Ready for future relations (example)
  relations: {
    // Example: if you have a Course entity
    // courses: {
    //   target: "Course",
    //   type: "one-to-many",
    //   inverseSide: "teacher",
    // },
    // enrollments: {
    //   target: "Enrollment",
    //   type: "one-to-many",
    //   inverseSide: "user",
    // },
  },
});

export default User;
