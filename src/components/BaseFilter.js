
export default {
    props: {
        games: Object
    },
    methods: {
        onFilter () {
            this.$emit('filter', this.getFilteredGames())
        },
        getFilteredGames () {
            
        }
    }
}