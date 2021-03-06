#pragma once

#include <bench/tests/test_template.hpp>
#include <bench/tests/qdb/node_status.hpp>
#include <bench/tests/qdb/quasardb_facade.hpp>
#include <utils/random.hpp>
#include <utils/unique_alias_provider.hpp>

namespace bench
{
namespace tests
{
namespace qdb
{

void set_watermark(std::string & str, unsigned long iteration)
{
    // print decimal representation in reverse order
    for (int digit = 0; digit < 10; digit++)
    {
        if (digit >= str.size()) break;
        str[digit] = iteration % 10;
        iteration /= 10;
    }
}

template <typename Derived>
class qdb_test_template : public test_template<Derived>, protected utils::unique_alias_provider
{
public:
    qdb_test_template(test_config config)
        : test_template<Derived>(config), _cluster_uri(config.cluster_uri)
    {
    }

    void setup() override
    {
        _qdb.connect(_cluster_uri);
    }

    static probe_collection create_probes(test_config cfg)
    {
        probe_collection probes;
        probes.emplace_back(new node_status(cfg.cluster_uri));
        return probes;
    }

protected:
    quasardb_facade _qdb;

private:
    std::string _cluster_uri;
};

} // namespace qdb
} // namespace tests
} // namespace bench
