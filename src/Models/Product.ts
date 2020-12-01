import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Batch } from './Batch';

@Entity({ name: 'Products' })
export class Product {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        length: 50,
    })
    name: string;

    @Column({
        length: 20,
        nullable: true,
    })
    code?: string;

    @Column({
        length: 30,
        nullable: true,
    })
    store?: string;

    @OneToMany((type) => Batch, (batch) => batch.product, {
        cascade: true,
        eager: true,
    })
    batches: Batch[];
}
