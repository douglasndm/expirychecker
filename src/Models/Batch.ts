import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './Product';

@Entity({ name: 'Batches' })
export class Batch {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column({
        type: 'date',
    })
    exp_date: Date;

    @Column({
        type: 'int',
        nullable: true,
    })
    amount?: number;

    @Column({
        type: 'decimal',
        nullable: true,
    })
    price?: number;

    @Column({
        type: 'varchar',
    })
    status?: string;

    @ManyToOne((type) => Product, (product) => product.batches, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    product: Product;
}
