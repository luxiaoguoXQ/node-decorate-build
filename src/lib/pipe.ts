const format: Function = value => {
    return {
        success: true,
        code: 200,
        message: '请求成功',
        data: value,
        test: 1
    }
}

export { format }