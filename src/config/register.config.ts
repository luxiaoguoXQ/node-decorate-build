import { CatsController } from "../cats/cats.controller"
import { NoticesController } from "../notices/notices.controller"

import { mapRoute, Factory } from "../lib/common"


export const REGISTER_CONTROLLER_LIST = [
    CatsController,
    NoticesController
]

export const HANDLECONFIGS = REGISTER_CONTROLLER_LIST.map((ins: any) => {
    return {
        controller: mapRoute(ins),
        instance: Factory(ins)
    }
})