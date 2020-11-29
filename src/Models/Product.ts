import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        length: 50,
    })
    name: string;

    @Column({
        length: 20,
    })
    code?: string;

    @Column({
        length: 30,
    })
    store?: string;
}
