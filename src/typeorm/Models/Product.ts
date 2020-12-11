import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Batch } from './Batch';

@Entity({ name: 'Products' })
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 50,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 20,
    })
    code?: string;

    @Column({
        type: 'varchar',
        length: 30,
    })
    store?: string;

    @OneToMany(() => Batch, (batch) => batch.product, {
        eager: true,
    })
    batches: Array<Batch>;
}
