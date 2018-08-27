package app.web.rest;

import app.WebappApp;

import app.domain.BlogEntry;
import app.domain.Blog;
import app.repository.BlogEntryRepository;
import app.service.BlogEntryService;
import app.repository.search.BlogEntrySearchRepository;
import app.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static app.web.rest.TestUtil.sameInstant;
import static app.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the BlogEntryResource REST controller.
 *
 * @see BlogEntryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = WebappApp.class)
public class BlogEntryResourceIntTest {

    private static final String DEFAULT_TITLE = "TITLE";
    private static final String UPDATED_TITLE = "TITLE UPDATE";
    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATION_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATION_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_LAST_MODIFIED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LAST_MODIFIED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private BlogEntryRepository blogEntryRepository;

    @Autowired
    private BlogEntryService blogEntryService;

    @Autowired
    private BlogEntrySearchRepository blogEntrySearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restBlogEntryMockMvc;

    private BlogEntry blogEntry;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BlogEntryResource blogEntryResource = new BlogEntryResource(blogEntryService);
        this.restBlogEntryMockMvc = MockMvcBuilders.standaloneSetup(blogEntryResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BlogEntry createEntity(EntityManager em) {
        BlogEntry blogEntry = new BlogEntry()
            .title(DEFAULT_TITLE)
            .text(DEFAULT_TEXT)
            .creationDate(DEFAULT_CREATION_DATE)
            .lastModified(DEFAULT_LAST_MODIFIED);
        // Add required entity
        Blog blog = BlogResourceIntTest.createEntity(em);
        em.persist(blog);
        em.flush();
        blogEntry.setBlog(blog);
        return blogEntry;
    }

    @Before
    public void initTest() {
        blogEntrySearchRepository.deleteAll();
        blogEntry = createEntity(em);
    }

    @Test
    @Transactional
    public void createBlogEntry() throws Exception {
        int databaseSizeBeforeCreate = blogEntryRepository.findAll().size();

        // Create the BlogEntry
        restBlogEntryMockMvc.perform(post("/api/blog-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(blogEntry)))
            .andExpect(status().isCreated());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeCreate + 1);
        BlogEntry testBlogEntry = blogEntryList.get(blogEntryList.size() - 1);
        assertThat(testBlogEntry.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testBlogEntry.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testBlogEntry.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
        assertThat(testBlogEntry.getLastModified()).isEqualTo(DEFAULT_LAST_MODIFIED);

        // Validate the BlogEntry in Elasticsearch
        BlogEntry blogEntryEs = blogEntrySearchRepository.findOne(testBlogEntry.getId());
        assertThat(testBlogEntry.getCreationDate()).isEqualTo(testBlogEntry.getCreationDate());
        assertThat(testBlogEntry.getLastModified()).isEqualTo(testBlogEntry.getLastModified());
        assertThat(blogEntryEs).isEqualToIgnoringGivenFields(testBlogEntry, "creationDate", "lastModified");
    }

    @Test
    @Transactional
    public void createBlogEntryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = blogEntryRepository.findAll().size();

        // Create the BlogEntry with an existing ID
        blogEntry.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBlogEntryMockMvc.perform(post("/api/blog-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(blogEntry)))
            .andExpect(status().isBadRequest());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTextIsRequired() throws Exception {
        int databaseSizeBeforeTest = blogEntryRepository.findAll().size();
        // set the field null
        blogEntry.setText(null);

        // Create the BlogEntry, which fails.

        restBlogEntryMockMvc.perform(post("/api/blog-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(blogEntry)))
            .andExpect(status().isBadRequest());

        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCreationDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = blogEntryRepository.findAll().size();
        // set the field null
        blogEntry.setCreationDate(null);

        // Create the BlogEntry, which fails.

        restBlogEntryMockMvc.perform(post("/api/blog-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(blogEntry)))
            .andExpect(status().isBadRequest());

        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllBlogEntries() throws Exception {
        // Initialize the database
        blogEntryRepository.saveAndFlush(blogEntry);

        // Get all the blogEntryList
        restBlogEntryMockMvc.perform(get("/api/blog-entries?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(blogEntry.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(sameInstant(DEFAULT_CREATION_DATE))))
            .andExpect(jsonPath("$.[*].lastModified").value(hasItem(sameInstant(DEFAULT_LAST_MODIFIED))));
    }

    @Test
    @Transactional
    public void getBlogEntry() throws Exception {
        // Initialize the database
        blogEntryRepository.saveAndFlush(blogEntry);

        // Get the blogEntry
        restBlogEntryMockMvc.perform(get("/api/blog-entries/{id}", blogEntry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(blogEntry.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT.toString()))
            .andExpect(jsonPath("$.creationDate").value(sameInstant(DEFAULT_CREATION_DATE)))
            .andExpect(jsonPath("$.lastModified").value(sameInstant(DEFAULT_LAST_MODIFIED)));
    }

    @Test
    @Transactional
    public void getNonExistingBlogEntry() throws Exception {
        // Get the blogEntry
        restBlogEntryMockMvc.perform(get("/api/blog-entries/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBlogEntry() throws Exception {
        // Initialize the database
        blogEntryService.save(blogEntry);

        int databaseSizeBeforeUpdate = blogEntryRepository.findAll().size();

        // Update the blogEntry
        BlogEntry updatedBlogEntry = blogEntryRepository.findOne(blogEntry.getId());
        // Disconnect from session so that the updates on updatedBlogEntry are not directly saved in db
        em.detach(updatedBlogEntry);
        updatedBlogEntry
            .title(UPDATED_TITLE)
            .text(UPDATED_TEXT)
            .creationDate(UPDATED_CREATION_DATE)
            .lastModified(UPDATED_LAST_MODIFIED);

        restBlogEntryMockMvc.perform(put("/api/blog-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBlogEntry)))
            .andExpect(status().isOk());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeUpdate);
        BlogEntry testBlogEntry = blogEntryList.get(blogEntryList.size() - 1);
        assertThat(testBlogEntry.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testBlogEntry.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testBlogEntry.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
        assertThat(testBlogEntry.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);

        // Validate the BlogEntry in Elasticsearch
        BlogEntry blogEntryEs = blogEntrySearchRepository.findOne(testBlogEntry.getId());
        assertThat(testBlogEntry.getCreationDate()).isEqualTo(testBlogEntry.getCreationDate());
        assertThat(testBlogEntry.getLastModified()).isEqualTo(testBlogEntry.getLastModified());
        assertThat(blogEntryEs).isEqualToIgnoringGivenFields(testBlogEntry, "creationDate", "lastModified");
    }

    @Test
    @Transactional
    public void updateNonExistingBlogEntry() throws Exception {
        int databaseSizeBeforeUpdate = blogEntryRepository.findAll().size();

        // Create the BlogEntry

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restBlogEntryMockMvc.perform(put("/api/blog-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(blogEntry)))
            .andExpect(status().isCreated());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteBlogEntry() throws Exception {
        // Initialize the database
        blogEntryService.save(blogEntry);

        int databaseSizeBeforeDelete = blogEntryRepository.findAll().size();

        // Get the blogEntry
        restBlogEntryMockMvc.perform(delete("/api/blog-entries/{id}", blogEntry.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean blogEntryExistsInEs = blogEntrySearchRepository.exists(blogEntry.getId());
        assertThat(blogEntryExistsInEs).isFalse();

        // Validate the database is empty
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchBlogEntry() throws Exception {
        // Initialize the database
        blogEntryService.save(blogEntry);

        // Search the blogEntry
        restBlogEntryMockMvc.perform(get("/api/_search/blog-entries?query=id:" + blogEntry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(blogEntry.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(sameInstant(DEFAULT_CREATION_DATE))))
            .andExpect(jsonPath("$.[*].lastModified").value(hasItem(sameInstant(DEFAULT_LAST_MODIFIED))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BlogEntry.class);
        BlogEntry blogEntry1 = new BlogEntry();
        blogEntry1.setId(1L);
        BlogEntry blogEntry2 = new BlogEntry();
        blogEntry2.setId(blogEntry1.getId());
        assertThat(blogEntry1).isEqualTo(blogEntry2);
        blogEntry2.setId(2L);
        assertThat(blogEntry1).isNotEqualTo(blogEntry2);
        blogEntry1.setId(null);
        assertThat(blogEntry1).isNotEqualTo(blogEntry2);
    }
}
