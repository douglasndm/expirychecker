import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Settings' })
export class Setting {
    @PrimaryColumn({
        type: 'varchar',
        length: 30,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 30,
    })
    value: string;
}
