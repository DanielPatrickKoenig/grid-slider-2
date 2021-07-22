
export default {
    props: {
        games: Object,
        selection: Object
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