import { Injectable } from "../lib/common";
import { BatsService } from "./bats.service";

@Injectable
export class CatsService {
    constructor(private readonly batsService: BatsService){}
    catName: string = 'jack'
    async getCatName(): Promise<string> {
        return this.batsService.getBatName()
    }
}