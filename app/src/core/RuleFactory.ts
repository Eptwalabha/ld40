import {RulePieceType, RuleAgainst, RuleRange} from "./Rule";
export class RuleFactory {

    private static matching (type: RuleAgainst): RulePieceType {
        if (type === RuleAgainst.SAME) {
            return RulePieceType.MATCHING;
        }
        return RulePieceType.AGAINST
    }

    public static get_none(type: RuleAgainst) {
        return RuleFactory.none(RuleFactory.matching(type));
    }

    public static get_neighbours(type: RuleAgainst, amount?: number = 8) {
        let valid = function (count: number) {
            return count === amount;
        };
        return RuleFactory.neighbours(RuleFactory.matching(type), valid);
    }

    public static get_surrounded(type: RuleAgainst) {
        let valid = function (count: number, potential) {
            return count === potential;
        };
        return RuleFactory.neighbours(RuleFactory.matching(type), valid);
    }

    public static get_group(range: RuleRange) {
        let valid = RuleFactory.get_valid(range);
        return RuleFactory.group(valid);
    }

    private static get_valid(range: RuleRange): (size: number) => boolean {
        if (range.max === undefined && range.min !== undefined) {
            return function (size) {
                return size >= range.min;
            }
        }
        if (range.max !== undefined && range.min === undefined) {
            return function (size) {
                return size <= range.max;
            }
        }
        if (range.max !== undefined && range.min !== undefined) {
            return function (size) {
                return size >= range.min && size <= range.max;
            }
        }
        return function (size) {
            return size >= 3;
        }
    }

    private static none (type: RulePieceType): (x: number, y: number, disposition: Array<Array<RulePieceType>>) => boolean {
        return function(x, y, dispositions) {
            for (let i = x - 1; i <= x + 1; ++i) {
                if (i < 0 || i >= dispositions.length) continue;
                for (let j = y - 1; j <= y + 1; ++j) {
                    if (j < 0 || j >= dispositions[i].length) continue;
                    if (i === x && j === y) continue;
                    if (dispositions[i][j] === type) {
                        return false;
                    }
                }
            }
            return true;
        }
    }

    private static neighbours(type: RulePieceType, valid: (count: number, potential: number) => boolean): (x: number, y: number, disposition: Array<Array<RulePieceType>>) => boolean {
        return function (x, y, disposition) {
            let count = 0;
            let potentialNeighbours = 0;
            for (let i = x - 1; i <= x + 1; ++i) {
                if (i < 0 || i >= disposition.length) continue;
                for (let j = y - 1; j <= y + 1; ++j) {
                    if (j < 0 || j >= disposition[i].length) continue;
                    if (i === x && j === y) continue;
                    potentialNeighbours++;
                    if (disposition[i][j] === type) {
                        count++;
                    }
                }
            }
            return valid(count, potentialNeighbours);
        }
    }

    private static group(valid: (count: number) => boolean): (x: number, y: number, disposition: Array<Array<RulePieceType>>) => boolean {
        return function (x: number, y: number, disposition) {
            interface Cell {
                visited: boolean,
                amount: number
            }
            let type = disposition[x][y];
            let cells: Array<Array<Cell>> = [];
            for (let i = 0; i < disposition.length; ++i) {
                cells[i] = [];
                for (let j = 0; j < disposition[i].length; ++j) {
                    cells[i][j] = null;
                    if (disposition[i][j] === type) {
                        cells[i][j] = {
                            visited: false,
                            amount: 1
                        }
                    }
                }
            }
            var getSize = function (amount: number, x: number, y: number): number {
                if (x < 0 || x >= cells.length || y < 0 || y >= cells[x].length) {
                    return amount;
                }
                let cell = cells[x][y];
                if (cell === null) {
                    return amount;
                }
                if (cell.visited) {
                    return (amount > cell.amount) ? amount : cell.amount;
                }
                cell.visited = true;
                cell.amount = amount;
                cell.amount = getSize(cell.amount , x - 1, y);
                cell.amount = getSize(cell.amount, x + 1, y);
                cell.amount = getSize(cell.amount, x, y - 1);
                return getSize(cell.amount, x, y + 1) + 1;
            };
            return valid(getSize(0, x, y));
        }
    }
}
