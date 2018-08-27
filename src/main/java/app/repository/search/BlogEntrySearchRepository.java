package app.repository.search;

import app.domain.BlogEntry;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the BlogEntry entity.
 */
public interface BlogEntrySearchRepository extends ElasticsearchRepository<BlogEntry, Long> {
}
