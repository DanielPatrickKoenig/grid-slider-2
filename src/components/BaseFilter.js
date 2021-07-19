
export default {
    props: {
        games: Object
    },
    methods: {
        onFilter () {
            this.$emit('filter', { values: this.getFilteredGames(), description: this.getDescription() });
        },
        getFilteredGames () {
            return {};  
        },
        getDescription () {
            return '';
        }
    }
}