const { sortPages } = require('../report')
const { test, expect } = require('@jest/globals')

describe('sortPages', () => {
    it('should correctly sort pages', () => {
        const input = {
            'https://cedaring.art/artwork': 1,
            'https://cedaring.art': 3
        }
        const actual = sortPages(input)
        const expected = [
            ['https://cedaring.art', 3],
            ['https://cedaring.art/artwork', 1]
        ]
        expect(actual).toEqual(expected)
    })
})
