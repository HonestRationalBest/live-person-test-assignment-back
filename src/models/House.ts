import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table
export class House extends Model<House> {
  @Column
  houseName!: string;

  @Column
  numberOfRooms!: number;

  @Column
  builtDate!: Date;

  @Column
  latitude!: number;

  @Column
  longitude!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
