import realm from '~/Services/Realm';

async function findBrandByName(name: string): Promise<IBrand> {
    const realmResponse = realm
        .objects<IBrand>('Brand')
        .filtered(`name ==[c] "${name}"`)[0]; // ==[c] makes the search insensitive

    return realmResponse;
}

export { findBrandByName };
