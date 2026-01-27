export enum TEAM_BONUS {
    moonsign = "moonsign",
    none = "none",
    hexerei = "hexerei",
    pyroelectro = "pyroelectro",
    hydrodendro = "hydrodendro",
    hydrocryo = "hydrocryo",
    chooseelement = "chooseelement",
    neuvillette = "neuvillette",
    // hardcode specifics - chooseelement + neuvillette
    // make sure for hydrocryo, pyroelectro, hydrodendro that all party members are hydro/cryo, pyro/electro, hydro/dendro
    // basically, check characters for specific team bonus, then check elements
}