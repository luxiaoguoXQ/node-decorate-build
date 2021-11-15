import { Injectable } from "../lib/common";
import { HatsService } from "./hats.service";

@Injectable
export class BatsService {
    constructor(private readonly hatsService: HatsService) {}
    batsName: string = 'hualazimi'
    async getBatName(): Promise<string> {
        const res = await this.hatsService.getBatName()
        const batName = res.data
        return batName + this.batsName
    }
}