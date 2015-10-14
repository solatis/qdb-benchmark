#pragma once

#include <bench/tests/qdb/qdb_test_template.hpp>
#include <utils/random.hpp>

namespace bench
{
namespace tests
{
namespace qdb
{
class hset_contains : public qdb_test_template<hset_contains>
{
public:
    explicit hset_contains(bench::test_config config) : qdb_test_template(config)
    {
        _content = utils::create_random_string(config.content_size);
    }

    void setup() override
    {
        qdb_test_template::setup();

        setup_each([=](unsigned long iteration)
                   {
                       set_watermark(_content, iteration);
                       _qdb.hset_insert(_alias, _content);
                   });
    }

    void run_iteration(unsigned long iteration)
    {
        set_watermark(_content, iteration);
        _qdb.hset_contains(_alias, _content);
    }

    void cleanup() override
    {
        _qdb.remove(_alias);
    }

    static std::string name()
    {
        return "qdb_hset_contains";
    }

    static std::string description()
    {
        return "Each thread repeats qdb_hset_contains() on one entry";
    }

    static bool size_dependent()
    {
        return true;
    }

private:
    std::string _content;
};
}
}
}
