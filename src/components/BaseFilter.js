
export default {
    props: {
        games: Object,
        selection: Object
    },
    methods: {
        onFilter () {
            this.$emit('filter', { values: this.getFilteredGames(), description: this.getDescription(), context: this.getContext() });
        },
        getFilteredGames () {
            return {};  
        },
        getDescription () {
            return '';
        },
        getContext () {
            return '';
        }
    }
}