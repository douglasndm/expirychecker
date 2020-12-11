import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './Product';

@Entity({ name: 'Batches' })
export class Batch {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
    })
    name: string;

    @Column({
        type: 'varchar',
    })
    exp_date: Date;

    @Column()
    amount?: number;

    @Column({
        type: 'decimal',
    })
    price?: number;

    @Column()
    status?: string;

    @ManyToOne(() => Product, (product) => product.batches)
    product: Product;
}
