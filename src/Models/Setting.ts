import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Settings' })
export class Setting {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        unique: true,
        length: 30,
    })
    name: string;

    @Column({
        length: 30,
    })
    value: string;
}
